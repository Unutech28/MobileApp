import { Navigation } from "react-native-navigation";
import { setCurrentComponent } from "../actions/componentStats";
var Events = {
    RegisterComponentDidAppearListener: (store) => {
        Navigation.events().registerComponentDidAppearListener(
            ({ componentId, componentName }) => {
                store.dispatch(setCurrentComponent({ componentId: componentId, componentName: componentName }));
            }
        )
    }
}
module.exports = Events;