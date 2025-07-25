import { ActionIcon, Box, Center, Group, Image, Kbd, Menu, Text, UnstyledButton } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Spotlight, type SpotlightActionData, type SpotlightActionGroupData, spotlight } from "@mantine/spotlight";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import type { JSX, SVGProps } from "react";
import { useTranslation } from "react-i18next";
import { linksdata } from "./Sidebar";
import * as classes from "./TopBar.css";

const appWindow = getCurrentWebviewWindow();

type MenuAction = {
  label: string;
  shortcut?: string;
  action?: () => void;
};

type MenuGroup = {
  label: string;
  options: MenuAction[];
};

const Icons = {
  minimizeWin: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Minimize Window</title>
      <path
        d="M0.498047 1.00098C0.429688 1.00098 0.364583 0.987956 0.302734 0.961914C0.244141 0.935872 0.192057 0.900065 0.146484 0.854492C0.100911 0.808919 0.0651042 0.756836 0.0390625 0.698242C0.0130208 0.636393 0 0.571289 0 0.50293C0 0.43457 0.0130208 0.371094 0.0390625 0.3125C0.0651042 0.250651 0.100911 0.19694 0.146484 0.151367C0.192057 0.102539 0.244141 0.0651042 0.302734 0.0390625C0.364583 0.0130208 0.429688 0 0.498047 0H9.50195C9.57031 0 9.63379 0.0130208 9.69238 0.0390625C9.75423 0.0651042 9.80794 0.102539 9.85352 0.151367C9.89909 0.19694 9.9349 0.250651 9.96094 0.3125C9.98698 0.371094 10 0.43457 10 0.50293C10 0.571289 9.98698 0.636393 9.96094 0.698242C9.9349 0.756836 9.89909 0.808919 9.85352 0.854492C9.80794 0.900065 9.75423 0.935872 9.69238 0.961914C9.63379 0.987956 9.57031 1.00098 9.50195 1.00098H0.498047Z"
        fill="currentColor"
        fillOpacity="0.8956"
      />
    </svg>
  ),
  maximizeWin: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Maximize Window</title>
      <path
        d="M1.47461 10.001C1.2793 10.001 1.09212 9.96191 0.913086 9.88379C0.734049 9.80241 0.576172 9.69499 0.439453 9.56152C0.30599 9.4248 0.198568 9.26693 0.117188 9.08789C0.0390625 8.90885 0 8.72168 0 8.52637V1.47559C0 1.28027 0.0390625 1.0931 0.117188 0.914062C0.198568 0.735026 0.30599 0.578776 0.439453 0.445312C0.576172 0.308594 0.734049 0.201172 0.913086 0.123047C1.09212 0.0416667 1.2793 0.000976562 1.47461 0.000976562H8.52539C8.7207 0.000976562 8.90788 0.0416667 9.08691 0.123047C9.26595 0.201172 9.4222 0.308594 9.55566 0.445312C9.69238 0.578776 9.7998 0.735026 9.87793 0.914062C9.95931 1.0931 10 1.28027 10 1.47559V8.52637C10 8.72168 9.95931 8.90885 9.87793 9.08789C9.7998 9.26693 9.69238 9.4248 9.55566 9.56152C9.4222 9.69499 9.26595 9.80241 9.08691 9.88379C8.90788 9.96191 8.7207 10.001 8.52539 10.001H1.47461ZM8.50098 9C8.56934 9 8.63281 8.98698 8.69141 8.96094C8.75326 8.9349 8.80697 8.89909 8.85254 8.85352C8.89811 8.80794 8.93392 8.75586 8.95996 8.69727C8.986 8.63542 8.99902 8.57031 8.99902 8.50195V1.5C8.99902 1.43164 8.986 1.36816 8.95996 1.30957C8.93392 1.24772 8.89811 1.19401 8.85254 1.14844C8.80697 1.10286 8.75326 1.06706 8.69141 1.04102C8.63281 1.01497 8.56934 1.00195 8.50098 1.00195H1.49902C1.43066 1.00195 1.36556 1.01497 1.30371 1.04102C1.24512 1.06706 1.19303 1.10286 1.14746 1.14844C1.10189 1.19401 1.06608 1.24772 1.04004 1.30957C1.014 1.36816 1.00098 1.43164 1.00098 1.5V8.50195C1.00098 8.57031 1.014 8.63542 1.04004 8.69727C1.06608 8.75586 1.10189 8.80794 1.14746 8.85352C1.19303 8.89909 1.24512 8.9349 1.30371 8.96094C1.36556 8.98698 1.43066 9 1.49902 9H8.50098Z"
        fill="currentColor"
        fillOpacity="0.8956"
      />
    </svg>
  ),
  maximizeRestoreWin: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Maximize/Restore Window</title>
      <path
        d="M8.99902 2.98096C8.99902 2.71077 8.94531 2.45687 8.83789 2.21924C8.73047 1.97835 8.58398 1.77002 8.39844 1.59424C8.21615 1.4152 8.00293 1.27523 7.75879 1.17432C7.5179 1.07015 7.264 1.01807 6.99707 1.01807H2.08496C2.13704 0.868327 2.21029 0.731608 2.30469 0.60791C2.39909 0.484212 2.50814 0.378418 2.63184 0.290527C2.75553 0.202637 2.89062 0.135905 3.03711 0.090332C3.18685 0.0415039 3.34147 0.0170898 3.50098 0.0170898H6.99707C7.41048 0.0170898 7.79948 0.0968424 8.16406 0.256348C8.52865 0.412598 8.84603 0.625814 9.11621 0.895996C9.38965 1.16618 9.60449 1.48356 9.76074 1.84814C9.92025 2.21273 10 2.60173 10 3.01514V6.51611C10 6.67562 9.97559 6.83024 9.92676 6.97998C9.88118 7.12646 9.81445 7.26156 9.72656 7.38525C9.63867 7.50895 9.53288 7.618 9.40918 7.7124C9.28548 7.8068 9.14876 7.88005 8.99902 7.93213V2.98096ZM1.47461 10.0171C1.2793 10.0171 1.09212 9.97803 0.913086 9.8999C0.734049 9.81852 0.576172 9.7111 0.439453 9.57764C0.30599 9.44092 0.198568 9.28304 0.117188 9.104C0.0390625 8.92497 0 8.73779 0 8.54248V3.49365C0 3.29508 0.0390625 3.10791 0.117188 2.93213C0.198568 2.75309 0.30599 2.59684 0.439453 2.46338C0.576172 2.32666 0.732422 2.21924 0.908203 2.14111C1.08724 2.05973 1.27604 2.01904 1.47461 2.01904H6.52344C6.72201 2.01904 6.91081 2.05973 7.08984 2.14111C7.26888 2.21924 7.42513 2.32503 7.55859 2.4585C7.69206 2.59196 7.79785 2.74821 7.87598 2.92725C7.95736 3.10628 7.99805 3.29508 7.99805 3.49365V8.54248C7.99805 8.74105 7.95736 8.92985 7.87598 9.10889C7.79785 9.28467 7.69043 9.44092 7.55371 9.57764C7.42025 9.7111 7.264 9.81852 7.08496 9.8999C6.90918 9.97803 6.72201 10.0171 6.52344 10.0171H1.47461ZM6.49902 9.01611C6.56738 9.01611 6.63086 9.00309 6.68945 8.97705C6.7513 8.95101 6.80501 8.9152 6.85059 8.86963C6.89941 8.82406 6.93685 8.77197 6.96289 8.71338C6.98893 8.65153 7.00195 8.58643 7.00195 8.51807V3.51807C7.00195 3.44971 6.98893 3.3846 6.96289 3.32275C6.93685 3.2609 6.90104 3.20719 6.85547 3.16162C6.8099 3.11605 6.75618 3.08024 6.69434 3.0542C6.63249 3.02816 6.56738 3.01514 6.49902 3.01514H1.49902C1.43066 3.01514 1.36556 3.02816 1.30371 3.0542C1.24512 3.08024 1.19303 3.11768 1.14746 3.1665C1.10189 3.21208 1.06608 3.26579 1.04004 3.32764C1.014 3.38623 1.00098 3.44971 1.00098 3.51807V8.51807C1.00098 8.58643 1.014 8.65153 1.04004 8.71338C1.06608 8.77197 1.10189 8.82406 1.14746 8.86963C1.19303 8.9152 1.24512 8.95101 1.30371 8.97705C1.36556 9.00309 1.43066 9.01611 1.49902 9.01611H6.49902Z"
        fill="currentColor"
        fillOpacity="0.8956"
      />
    </svg>
  ),
  closeWin: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Close Window</title>
      <path
        d="M5 5.70898L0.854492 9.85449C0.756836 9.95215 0.639648 10.001 0.50293 10.001C0.359701 10.001 0.239258 9.95378 0.141602 9.85938C0.0472005 9.76172 0 9.64128 0 9.49805C0 9.36133 0.0488281 9.24414 0.146484 9.14648L4.29199 5.00098L0.146484 0.855469C0.0488281 0.757812 0 0.638997 0 0.499023C0 0.430664 0.0130208 0.36556 0.0390625 0.303711C0.0651042 0.241862 0.100911 0.189779 0.146484 0.147461C0.192057 0.101888 0.245768 0.0660807 0.307617 0.0400391C0.369466 0.0139974 0.43457 0.000976562 0.50293 0.000976562C0.639648 0.000976562 0.756836 0.0498047 0.854492 0.147461L5 4.29297L9.14551 0.147461C9.24316 0.0498047 9.36198 0.000976562 9.50195 0.000976562C9.57031 0.000976562 9.63379 0.0139974 9.69238 0.0400391C9.75423 0.0660807 9.80794 0.101888 9.85352 0.147461C9.89909 0.193034 9.9349 0.246745 9.96094 0.308594C9.98698 0.367188 10 0.430664 10 0.499023C10 0.638997 9.95117 0.757812 9.85352 0.855469L5.70801 5.00098L9.85352 9.14648C9.95117 9.24414 10 9.36133 10 9.49805C10 9.56641 9.98698 9.63151 9.96094 9.69336C9.9349 9.75521 9.89909 9.80892 9.85352 9.85449C9.8112 9.90007 9.75911 9.93587 9.69727 9.96191C9.63542 9.98796 9.57031 10.001 9.50195 10.001C9.36198 10.001 9.24316 9.95215 9.14551 9.85449L5 5.70898Z"
        fill="currentColor"
        fillOpacity="0.8956"
      />
    </svg>
  ),
};

function getActions(navigate: any, t: any): (SpotlightActionGroupData | SpotlightActionData)[] {
  return [
    {
      group: "Pages",
      actions: linksdata.map((link) => {
        const label = t(`SideBar.${link.label}`);

        return {
          id: link.label,
          label,
          description: `Go to ${label} page`,
          onClick: () => navigate({ to: link.url }),
          leftSection: <link.icon size={24} stroke={1.5} />,
        };
      }),
    },
    {
      group: "Settings",
      actions: [
        {
          id: "settings",
          label: t("SideBar.Settings"),
          description: `Open ${t("SideBar.Settings")} page`,
          onClick: () => navigate({ to: "/settings" }),
          leftSection: <IconSettings size={24} stroke={1.5} />,
        },
      ],
    },
  ];
}

function TopBar({ menuActions }: { menuActions: MenuGroup[] }) {
  const colorScheme = useColorScheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Group h="100%">
      <Box>
        <Group data-tauri-drag-region gap="xs" px="sm">
          <Box h="1.4rem" w="1.4rem">
            <Image src="/logo.png" fit="fill" />
          </Box>
          <Group gap={0}>
            {menuActions.map((action) => (
              <Menu
                key={action.label}
                shadow="md"
                width={200}
                position="bottom-start"
                transitionProps={{ duration: 0 }}
              >
                <Menu.Target>
                  <UnstyledButton
                    fz="xs"
                    px="xs"
                    variant="subtle"
                    color={colorScheme === "dark" ? "gray" : "dark"}
                    size="compact-md"
                  >
                    {action.label}
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {action.options.map((option, i) =>
                    option.label === "divider" ? (
                      <Menu.Divider key={i} />
                    ) : (
                      <Menu.Item
                        key={option.label}
                        rightSection={
                          option.shortcut && (
                            <Text size="xs" c="dimmed">
                              {option.shortcut}
                            </Text>
                          )
                        }
                        onClick={option.action}
                      >
                        {option.label}
                      </Menu.Item>
                    ),
                  )}
                </Menu.Dropdown>
              </Menu>
            ))}
          </Group>
        </Group>
      </Box>
      <Group style={{ flexGrow: 1 }} justify="center">
        <UnstyledButton
          onClick={spotlight.open}
          size="xs"
          pl="12px"
          pr="4px"
          py="2px"
          style={{
            border: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
            borderRadius: "4px",
          }}
        >
          <Group w="100%">
            <IconSearch size={14} stroke={1.5} color="var(--mantine-color-dimmed)" />
            <Text pr="200px" c="dimmed" size="sm">
              Spotlight Search
            </Text>
            <Kbd size="xs" style={{ borderWidth: "1px" }}>
              mod + P
            </Kbd>
          </Group>
        </UnstyledButton>
        <Spotlight
          actions={getActions(navigate, t)}
          shortcut="mod + P"
          nothingFound="Nothing found..."
          highlightQuery
          searchProps={{
            leftSection: <IconSearch size={20} stroke={1.5} />,
            placeholder: "Search...",
          }}
        />
      </Group>
      <Center h="30" mr="xs">
        <Group gap="5px" data-tauri-drag-region>
          <ActionIcon h={25} w={25} radius="lg" onClick={() => appWindow.minimize()} className={classes.icon}>
            <Icons.minimizeWin />
          </ActionIcon>
          <ActionIcon h={25} w={25} radius="lg" onClick={() => appWindow.toggleMaximize()} className={classes.icon}>
            <Icons.maximizeWin />
          </ActionIcon>
          <ActionIcon h={25} w={25} radius="lg" onClick={() => appWindow.close()} className={classes.icon}>
            <Icons.closeWin />
          </ActionIcon>
        </Group>
      </Center>
    </Group>
  );
}

export default TopBar;
