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
          Thank you for using Alarms ! ❤️
        </Text>
      </Section>

      <Section
        title={<Text bold align="center">Theme Color</Text>}>

        <Text>You can customize the color only if you have a valid unlock code.</Text>

        <Text>
          To get an unlock code, you have to donate at least $1 via <Link source='https://paypal.me/rootasjey'>Paypal</Link>.
        </Text>

        <Text>
          Then send <Link source='mailto:jeremiecorpinot@outlook.com'>me an email</Link> with the '[Alarms-fitbit] Code' subject in which you specify the amount given.
          I'll respond with the code and you'll be able to enter it in the field below.
        </Text>

        <Text>
          Once you enter and validate the code by taping on the 'save' button, selecting colors below will take effect.
        </Text>

        <TextInput
          placeholder="Unlock Code"
          settingsKey="unlockCode"
          title="Unlock Code"
        />

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

      <Section title={<Text bold align="center">Help</Text>}>
        <Text>
          You can read the <Link source="https://github.com/rootasjey/alarms-fitbit">GitHub's readme page.</Link>
        </Text>
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

      <Section title={<Text bold align="center">About</Text>}>
        <Text>
          This project is open sourced on <Link source='https://github.com/rootasjey/alarms-fitbit'>GitHub.</Link>
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
