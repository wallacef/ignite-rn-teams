import { TouchableOpacityProps } from 'react-native'
import { ButtonTypeStyleProps, Container, Title } from './styles'

type TProps = TouchableOpacityProps & {
    title: string
    type?: ButtonTypeStyleProps
    spaced?: boolean
}

export function Button({ title, type = 'PRIMARY', ...rest }: TProps) {
    return (
        <Container
            type={type}
            {...rest}
        >
            <Title>
                {title}
            </Title>
        </Container>
    )
}