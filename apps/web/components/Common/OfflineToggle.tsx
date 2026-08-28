import React, { useState } from "react";
import { Switch, Group, Text } from "@mantine/core";

const OfflineToggle = () => {
	const [offline, setOffline] = useState(false);
	return (
		<Group gap="xs" wrap="nowrap" align="center">
			<Switch
				checked={offline}
				onChange={(event) => setOffline(event.currentTarget.checked)}
				disabled
				size="xs"
			/>
			<Text size="sm">Offline</Text>
		</Group>
	);
};

export default OfflineToggle;
