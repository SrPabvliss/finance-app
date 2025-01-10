import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FriendsScreen from '@/screens/main/FriendsScreen';

export type FriendsStackParamList = {
  FriendsList: undefined;
};

const Stack = createNativeStackNavigator<FriendsStackParamList>();

export default function FriendsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FriendsList" component={FriendsScreen} options={{ title: 'Amigos' }} />
    </Stack.Navigator>
  );
}
