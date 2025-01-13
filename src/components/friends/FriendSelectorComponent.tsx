import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Users } from 'lucide-react-native';
import { friendsApi, Friend } from '@/api/services/friends-api';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/LoadingComponent';

interface FriendSelectorProps {
  enabled: boolean;
  selectedFriendId?: number;
  onToggle: () => void;
  onFriendSelect: (friendId: number) => void;
  checkboxMessage?: string;
}

export default function FriendSelector({
  enabled,
  selectedFriendId,
  onToggle,
  onFriendSelect,
  checkboxMessage = 'Compartir Transacción',
}: FriendSelectorProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadFriends = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await friendsApi.getByUser(user.id);
        setFriends(data);
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (enabled) {
      loadFriends();
    }
  }, [enabled, user]);

  return (
    <View className="space-y-4">
      <TouchableOpacity onPress={onToggle} className="flex-row items-center space-x-2">
        <View
          className={`h-6 w-6 items-center justify-center rounded-md border ${enabled ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
        >
          <View className={`h-3 w-3 rounded-sm ${enabled ? 'bg-white' : 'bg-transparent'}`} />
        </View>
        <Text className="text-base text-gray-700">{checkboxMessage}</Text>
      </TouchableOpacity>

      {enabled && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Seleccionar amigo</Text>

          {isLoading ? (
            <Loading size="small" />
          ) : friends.length === 0 ? (
            <View className="rounded-lg bg-gray-100 p-4">
              <Text className="text-center text-gray-500">No tienes amigos agregados</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row space-x-2"
            >
              {friends.map(friend => (
                <TouchableOpacity
                  key={friend.id}
                  onPress={() => onFriendSelect(friend.friend.id)}
                  className={`
                    flex-row items-center space-x-2 rounded-lg px-4 py-3
                    ${selectedFriendId === friend.friend.id ? 'bg-blue-100' : 'bg-gray-100'}
                  `}
                >
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                    <Text className="text-sm font-medium text-white">
                      {friend.friend.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      className={`
                      text-sm font-medium
                      ${selectedFriendId === friend.friend.id ? 'text-blue-600' : 'text-gray-600'}
                    `}
                    >
                      {friend.friend.name}
                    </Text>
                    <Text className="text-xs text-gray-500">@{friend.friend.username}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
