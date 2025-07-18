use std::{collections::VecDeque, path::PathBuf, sync::Mutex};

use diesel::{dsl::sql, sql_types::Bool, Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use once_cell::sync::Lazy;
use serde::Serialize;
use specta::Type;
use tauri::{path::BaseDirectory, Manager};

use crate::{
    db::{puzzles, Puzzle},
    error::Error,
};

/// Cache for puzzles to reduce database queries
#[derive(Debug)]
struct PuzzleCache {
    /// Queue of puzzles loaded from the database
    cache: VecDeque<Puzzle>,
    /// Current position in the cache
    counter: usize,
    /// Minimum rating filter used for the current cache
    min_rating: u16,
    /// Maximum rating filter used for the current cache
    max_rating: u16,
    /// Maximum number of puzzles to cache at once
    cache_size: usize,
}

impl PuzzleCache {
    /// Create a new puzzle cache with default settings
    fn new() -> Self {
        Self {
            cache: VecDeque::new(),
            counter: 0,
            min_rating: 0,
            max_rating: 0,
            cache_size: 20, // Default cache size
        }
    }
    
    /// Configure the cache size
    ///
    /// # Arguments
    /// * `size` - The maximum number of puzzles to cache at once
    #[allow(dead_code)]
    fn with_cache_size(mut self, size: usize) -> Self {
        self.cache_size = size;
        self
    }

    /// Loads puzzles into the cache if needed
    ///
    /// This method will reload the cache if:
    /// - The cache is empty
    /// - The rating filters have changed
    /// - We've reached the end of the current cache
    ///
    /// # Arguments
    /// * `file` - Path to the puzzle database
    /// * `min_rating` - Minimum puzzle rating to include
    /// * `max_rating` - Maximum puzzle rating to include
    ///
    /// # Returns
    /// * `Ok(())` if puzzles were loaded successfully
    /// * `Err(Error)` if there was a problem loading puzzles
    fn get_puzzles(&mut self, file: &str, min_rating: u16, max_rating: u16) -> Result<(), Error> {
        if self.cache.is_empty()
            || self.min_rating != min_rating
            || self.max_rating != max_rating
            || self.counter >= self.cache_size
        {
            self.cache.clear();
            self.counter = 0;

            let mut db = diesel::SqliteConnection::establish(file)?;
            let new_puzzles = puzzles::table
                .filter(puzzles::rating.le(max_rating as i32))
                .filter(puzzles::rating.ge(min_rating as i32))
                .order(sql::<Bool>("RANDOM()"))
                .limit(self.cache_size as i64)
                .load::<Puzzle>(&mut db)?;

            self.cache = new_puzzles.into_iter().collect();
            self.min_rating = min_rating;
            self.max_rating = max_rating;
        }

        Ok(())
    }

    /// Gets the next puzzle from the cache
    ///
    /// # Returns
    /// * `Some(&Puzzle)` if a puzzle is available
    /// * `None` if no more puzzles are available in the cache
    fn get_next_puzzle(&mut self) -> Option<&Puzzle> {
        if let Some(puzzle) = self.cache.get(self.counter) {
            self.counter += 1;
            Some(puzzle)
        } else {
            None
        }
    }
}

/// Gets a random puzzle from the database within the specified rating range
///
/// This function uses a cache to avoid repeated database queries. The cache is
/// refreshed when it's empty, when the rating range changes, or when all puzzles
/// in the cache have been used.
///
/// # Arguments
/// * `file` - Path to the puzzle database
/// * `min_rating` - Minimum puzzle rating to include
/// * `max_rating` - Maximum puzzle rating to include
///
/// # Returns
/// * `Ok(Puzzle)` if a puzzle was found
/// * `Err(Error::NoPuzzles)` if no puzzles match the criteria
/// * Other errors if there was a problem accessing the database
#[tauri::command]
#[specta::specta]
pub fn get_puzzle(file: String, min_rating: u16, max_rating: u16) -> Result<Puzzle, Error> {
    static PUZZLE_CACHE: Lazy<Mutex<PuzzleCache>> = Lazy::new(|| Mutex::new(PuzzleCache::new()));

    let mut cache = PUZZLE_CACHE.lock().map_err(|e| {
        Error::MutexLockFailed(format!("Failed to lock puzzle cache: {}", e))
    })?;
    cache.get_puzzles(&file, min_rating, max_rating)?;
    
    // Get a reference to the next puzzle and clone it only if found
    match cache.get_next_puzzle() {
        Some(puzzle) => Ok(puzzle.clone()),
        None => Err(Error::NoPuzzles)
    }
}

/// Information about a puzzle database
#[derive(Serialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct PuzzleDatabaseInfo {
    /// The title of the puzzle database (derived from filename)
    title: String,
    /// Description of the puzzle database (currently not populated)
    /// TODO: Consider adding a way to store and retrieve database descriptions
    description: String,
    /// Number of puzzles in the database
    puzzle_count: i32,
    /// Size of the database file in bytes
    storage_size: i32,
    /// Full path to the database file
    path: String,
}

/// Gets information about a puzzle database
///
/// This function retrieves metadata about a puzzle database, including:
/// - The title (derived from the filename)
/// - The number of puzzles in the database
/// - The size of the database file
/// - The full path to the database file
///
/// # Arguments
/// * `file` - Relative path to the puzzle database within the app's data directory
/// * `app` - Tauri app handle used to resolve the full path
///
/// # Returns
/// * `Ok(PuzzleDatabaseInfo)` with the database information
/// * `Err(Error)` if there was a problem accessing the database or file
#[tauri::command]
#[specta::specta]
pub async fn get_puzzle_db_info(
    file: PathBuf,
    app: tauri::AppHandle,
) -> Result<PuzzleDatabaseInfo, Error> {
    // Ensure we're working with a relative path by checking if it's absolute
    let file_path = if file.is_absolute() {
        // If it's already absolute, use it directly
        file
    } else {
        // Otherwise, resolve it relative to the puzzles directory in AppData
        let db_path = PathBuf::from("puzzles").join(file);
        app.path().resolve(db_path, BaseDirectory::AppData)?
    };

    let mut db = diesel::SqliteConnection::establish(&file_path.to_string_lossy())?;

    let puzzle_count = puzzles::table.count().get_result::<i64>(&mut db)? as i32;

    let storage_size = file_path.metadata()?.len() as i32;
    let filename = file_path.file_name()
        .ok_or_else(|| std::io::Error::new(
            std::io::ErrorKind::InvalidInput, 
            "Invalid path: no filename")
        )?
        .to_string_lossy();

    Ok(PuzzleDatabaseInfo {
        title: filename.to_string(),
        description: "".to_string(),
        puzzle_count,
        storage_size,
        path: file_path.to_string_lossy().to_string(),
    })
}
