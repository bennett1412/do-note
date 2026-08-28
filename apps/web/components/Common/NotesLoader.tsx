import { Card, SimpleGrid, Skeleton, Stack } from "@mantine/core";

const SkeletonNote = () => (
  <Card h={180} radius="md" padding="lg" shadow="sm" withBorder>
    <Stack gap="md">
      <Skeleton height={20} width="60%" />
      <Skeleton height={12} />
      <Skeleton height={12} width="80%" />
      <Skeleton height={12} width="40%" />
    </Stack>
  </Card>
);

const NotesLoader = () => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={24} p={24}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonNote key={i} />
      ))}
    </SimpleGrid>
  );
};

export default NotesLoader;