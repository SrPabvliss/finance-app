import React, { useCallback, useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { FriendList } from '@/components/friends/FriendList';
import { AddFriendModal } from '@/components/friends/AddFriendModal';
import { Friend, friendsApi } from '@/api/services/friends-api';

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  const loadFriends = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleAddFriend = async (email: string) => {
    try {
      if (!user) return;
      await friendsApi.create({
        user_id: user.id,
        friend_email: email,
      });
      loadFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  };

  const handleDeleteFriend = (friendId: number) => {
    Alert.alert('Eliminar amigo', '¿Estás seguro de que deseas eliminar este amigo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await friendsApi.delete(friendId);
            loadFriends();
          } catch (error) {
            console.error('Error deleting friend:', error);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Button title="Agregar amigo" onPress={() => setShowAddModal(true)} />
      </View>

      <FriendList friends={friends} onDelete={handleDeleteFriend} />

      <AddFriendModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddFriend}
      />
    </SafeAreaView>
  );
}
