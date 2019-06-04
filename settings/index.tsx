function settingsComponent(props: SettingsComponentProps) {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            App Settings
          </Text>
        }
      >
        <Text>
          Thank you using Alarms.
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
