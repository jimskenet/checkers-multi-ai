import {Modal as RNModal, ModalProps, KeyboardAvoidingView, View} from 'react-native'
import styles from '../app/styles/modal_styles'
type PROPS = ModalProps & {
    isOpen: boolean
    withInput?: boolean
}

export const Modal = ({isOpen, withInput, children, ...rest}: PROPS) =>{
    const content = withInput ? (
        <KeyboardAvoidingView style={styles.centeredView}>
          <View style={styles.modalView}>
            {children}
          </View>
        </KeyboardAvoidingView>
    ) : (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {children}
          </View>
        </View>
    )
    
    return (
        <RNModal
            animationType='fade'
            transparent={true}
            visible={isOpen}
            {...rest}
        >
            {content}
        </RNModal>
    )
}