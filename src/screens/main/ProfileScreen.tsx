import { View, Text, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Users, LogOut, Wallet } from 'lucide-react-native';
import { useState } from 'react';
import { FriendList } from '@/components/friends/FriendList';
import { AddFriendModal } from '@/components/friends/AddFriendModal';
import { Friend, friendsApi } from '@/api/services/friends-api';
import { PaymentMethod, paymentMethodsApi } from '@/api/services/payment-methods-api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import PaymentMethodForm from '@/components/payment-methods/PaymentMethodForm';
import PaymentMethodCard from '@/components/payment-methods/PaymentMethodCard';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<'main' | 'friends' | 'paymentMethods'>(
    'main'
  );
  const [friends, setFriends] = useState<Friend[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showEditPaymentMethod, setShowEditPaymentMethod] = useState(false);

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

  const handleShowFriends = () => {
    setCurrentSection('friends');
    loadFriends();
  };

  const handleShowPaymentMethods = () => {
    setCurrentSection('paymentMethods');
    loadPaymentMethods();
  };

  const handleAddFriend = async (email: string) => {
    if (!user) return;
    try {
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

  const handleAddPaymentMethod = async (data: any) => {
    if (!user) return;
    try {
      await paymentMethodsApi.create({
        ...data,
        user_id: user.id,
      });
      loadPaymentMethods();
      setShowAddPaymentMethod(false);
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  };

  const handleEditPaymentMethod = async (data: any) => {
    if (!user || !selectedPaymentMethod) return;
    try {
      await paymentMethodsApi.update(selectedPaymentMethod.id, data);
      loadPaymentMethods();
      setShowEditPaymentMethod(false);
      setSelectedPaymentMethod(null);
    } catch (error) {
      console.error('Error updating payment method:', error);
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
            loadFriends(); // Recargar la lista después de eliminar
          } catch (error) {
            console.error('Error deleting friend:', error);
            Alert.alert('Error', 'No se pudo eliminar el amigo');
          }
        },
      },
    ]);
  };

  const handleDeletePaymentMethod = (method: PaymentMethod) => {
    Alert.alert(
      'Eliminar método de pago',
      '¿Estás seguro de que deseas eliminar este método de pago?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentMethodsApi.delete(method.id);
              loadPaymentMethods();
            } catch (error) {
              console.error('Error deleting payment method:', error);
            }
          },
        },
      ]
    );
  };

  const loadPaymentMethods = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await paymentMethodsApi.getByUser(user.id);
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View className="items-center p-6 bg-gray-50">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        <Text className="text-3xl font-bold text-blue-500">
          {user?.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text className="mt-4 text-xl font-bold">{user?.name}</Text>
      <Text className="text-gray-600">@{user?.username}</Text>
      <Text className="text-gray-600">{user?.email}</Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) return <Loading />;

    switch (currentSection) {
      case 'friends':
        return (
          <>
            <View className="flex-row justify-center gap-2 items-center">
              <Button
                title="Volver"
                variant="secondary"
                onPress={() => setCurrentSection('main')}
                className="flex-1"
              />
              <Button
                title="Agregar amigo"
                onPress={() => setShowAddModal(true)}
                className="flex-1"
              />
            </View>
            <FriendList friends={friends} onDelete={handleDeleteFriend} />
          </>
        );
      case 'paymentMethods':
        return (
          <FlatList
            data={paymentMethods}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={
              <View className="flex-row justify-center gap-2 items-center">
                <Button
                  title="Volver"
                  variant="secondary"
                  onPress={() => setCurrentSection('main')}
                  className="flex-1"
                />
                <Button
                  title="Nuevo método"
                  onPress={() => setShowAddPaymentMethod(true)}
                  className="flex-1"
                />
              </View>
            }
            renderItem={({ item }) => (
              <PaymentMethodCard
                {...item}
                onPress={() => {
                  setSelectedPaymentMethod(item);
                  setShowEditPaymentMethod(true);
                }}
                onDeletePress={() => handleDeletePaymentMethod(item)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          />
        );
      default:
        return (
          <View className="space-y-4">
            <TouchableOpacity
              onPress={handleShowPaymentMethods}
              className="flex-row items-center p-4 bg-gray-50 rounded-lg"
            >
              <Wallet size={24} className="text-gray-700" />
              <Text className="ml-4 text-lg">Métodos de pago</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShowFriends}
              className="flex-row items-center p-4 bg-gray-50 rounded-lg"
            >
              <Users size={24} className="text-gray-700" />
              <Text className="ml-4 text-lg">Gestionar amigos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              className="flex-row items-center p-4 bg-red-50 rounded-lg"
            >
              <LogOut size={24} className="text-red-500" />
              <Text className="ml-4 text-lg text-red-500">Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        ListHeaderComponent={renderHeader()}
        data={[]}
        renderItem={null}
        ListEmptyComponent={renderContent()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <AddFriendModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddFriend}
      />

      <Modal
        visible={showAddPaymentMethod}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddPaymentMethod(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="mt-auto rounded-t-3xl bg-white p-6">
            <View className="mb-6">
              <Text className="text-xl font-semibold text-center">Nuevo método de pago</Text>
            </View>
            <PaymentMethodForm
              onSubmit={handleAddPaymentMethod}
              onCancel={() => setShowAddPaymentMethod(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
