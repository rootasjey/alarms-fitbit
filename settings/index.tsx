function settingsComponent(props: SettingsComponentProps) {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
          </Text>
        }
      >
        <Text>
          Thank you using Alarms ! ❤️
        </Text>
      </Section>

      <Section
        title={<Text bold align="center">Theme Color</Text>}>

        <Text>This will change the clock's color</Text>

        <ColorSelect
          settingsKey="foregroundColor"
          colors={[
            { color: '#f1c40f' },
            { color: '#2ecc71' },
            { color: '#3498db' },
            { color: '#9b59b6' },
            { color: '#34495e' },
            { color: '#2bcbba' },
            { color: '#e67e22' },
            { color: '#e74c3c' },
            { color: '#ecf0f1' },
            { color: '#6ab04c' },
            { color: '#4834d4' },
            { color: '#f78fb3' },
            { color: '#cf6a87' },
            { color: '#eb3b5a' },
          ]}
        />
      </Section>

      <Section title={<Text bold align="center">Contact</Text>}>
        <Text>
          You can contact me on <Link source='https://twitter.com/jeremiecorpinot'>Twitter </Link>
          or by <Link source='mailto:jeremiecorpinot@outlook.com'>email</Link>.
        </Text>

        <Text>
          You can ask there for a <Link source="https://github.com/rootasjey/alarms-fitbit/issues/new"> new feature or report an issue</Link>.
        </Text>
      </Section>

      <Section title={<Text bold align="center">Support</Text>}>
        <Text>
          Please support the app on <Link source='https://paypal.me/rootasjey'>Paypal</Link> if you enjoy using it.
        </Text>
      </Section>

      <Section title={<Text bold align="center">About</Text>}>
        <Text>
          This project is open sourced on <Link source='https://github.com/rootasjey/alarms-fitbit'>GitHub.</Link>
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
