// import the screens
import Start from './components/Start';
import Screen2 from './components/Screen2';

// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// Create the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Screen2: { screen: Screen2 }
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;