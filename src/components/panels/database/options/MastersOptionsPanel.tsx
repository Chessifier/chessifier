import { Group } from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { useAtom } from "jotai";
import { masterOptionsAtom } from "@/state/atoms";
import { MIN_DATE } from "@/utils/lichess/api";

const MasterOptionsPanel = () => {
  const [options, setOptions] = useAtom(masterOptionsAtom);
  return (
    <Group grow>
      <YearPickerInput
        label="Since"
        placeholder="Pick date"
        value={options.since}
        minDate={MIN_DATE}
        maxDate={new Date()}
        onChange={(value) => setOptions({ ...options, since: (value ?? undefined) as Date | undefined })}
        clearable
      />
      <YearPickerInput
        label="Until"
        placeholder="Pick date"
        value={options.until}
        minDate={MIN_DATE}
        maxDate={new Date()}
        onChange={(value) => setOptions({ ...options, until: (value ?? undefined) as Date | undefined })}
        clearable
      />
    </Group>
  );
};

export default MasterOptionsPanel;
