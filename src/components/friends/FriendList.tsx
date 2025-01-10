import { FlatList, Text, View } from 'react-native';
import { FriendCard } from './FriendCard';
import { Friend } from '@/api/services/friends-api';

export function FriendList({
  friends,
  onDelete,
}: {
  friends: Friend[];
  onDelete: (id: number) => void;
}) {
  if (friends.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500">No tienes amigos agregados</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View className="px-4 py-2">
          <FriendCard friend={item} onDelete={onDelete} />
        </View>
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
    />
  );
}
