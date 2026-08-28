import React from "react";
import { Group, Badge } from "@mantine/core";

const Tags = ({ tags = ["books", "coding"] }) => {
	return (
		<Group gap="xs">
			{tags.map((tag, i) => (
				<Badge key={i} variant="light" size="sm" radius="md">
					{tag}
				</Badge>
			))}
		</Group>
	);
};

export default Tags;
