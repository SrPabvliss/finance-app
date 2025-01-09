import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethod, paymentMethodsApi } from '@/api/services/payment-methods-api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { PaymentMethodsStackParamList } from '@/navigation/PaymentMethodsNavigator';
import PaymentMethodCard from '@/components/payment-methods/PaymentMethodCard';

type PaymentMethodsScreenNavigationProp = NativeStackNavigationProp<
  PaymentMethodsStackParamList,
  'PaymentMethodsList'
>;

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();

  const loadPaymentMethods = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    loadPaymentMethods();

    const unsubscribe = navigation.addListener('focus', () => {
      loadPaymentMethods();
    });

    return unsubscribe;
  }, [navigation, loadPaymentMethods]);

  const handleNewPaymentMethod = () => {
    navigation.navigate('PaymentMethodForm', {
      mode: 'create',
    });
  };

  const handlePaymentMethodPress = (paymentMethod: PaymentMethod) => {
    navigation.navigate('PaymentMethodForm', {
      mode: 'edit',
      paymentMethod,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Button title="Nuevo método de pago" onPress={handleNewPaymentMethod} />
      </View>

      <FlatList
        data={paymentMethods}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View className="px-4 py-2">
            <PaymentMethodCard {...item} onPress={() => handlePaymentMethodPress(item)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
