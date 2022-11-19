import { NavigationContainer } from '@react-navigation/native'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { AppRouter } from './app.routes'

export function Routes() {
    const { COLORS } = useTheme()
    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.GRAY_600
        }}
        >
            <NavigationContainer>
                <AppRouter />
            </NavigationContainer>
        </View>
    )
}