import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
  
  type TabsContextValue = {
    value: string;
    onChange: (val: string) => void;
  };
  
  const TabsContext = createContext<TabsContextValue | null>(null);
  
  function useTabsContext(component: string): TabsContextValue {
    const ctx = useContext(TabsContext);
    if (!ctx) {
      throw new Error(`${component} debe estar dentro de <Tabs>`);
    }
    return ctx;
  }
  
  interface TabsProps {
    /** valor actual de la pestaña activa */
    value?: string;
    /** valor inicial si no quieres controlar desde fuera */
    defaultValue?: string;
    /** callback cuando cambia la pestaña */
    onValueChange?: (value: string) => void;
    children: ReactNode;
    style?: ViewStyle;
  }
  
  export const Tabs: React.FC<TabsProps> = ({
    value: controlledValue,
    defaultValue,
    onValueChange,
    children,
    style,
  }) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  
    const isControlled = controlledValue !== undefined && controlledValue !== null;
    const value = isControlled ? (controlledValue as string) : internalValue;
  
    const handleChange = (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
    };
  
    const ctxValue = useMemo(
      () => ({ value, onChange: handleChange }),
      [value],
    );
  
    return (
      <TabsContext.Provider value={ctxValue}>
        <View style={[styles.tabsRoot, style]}>{children}</View>
      </TabsContext.Provider>
    );
  };
  
  interface TabsListProps {
    children: ReactNode;
    style?: ViewStyle;
  }
  
  /**
   * Contenedor de los botones (triggers)
   */
  export const TabsList: React.FC<TabsListProps> = ({ children, style }) => {
    return <View style={[styles.tabsList, style]}>{children}</View>;
  };
  
  interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
  }
  
  /**
   * Botón de cada pestaña
   */
  export const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    children,
    style,
    textStyle,
  }) => {
    const { value: activeValue, onChange } = useTabsContext('TabsTrigger');
    const active = value === activeValue;
  
    return (
      <TouchableOpacity
        style={[
          styles.tabsTrigger,
          active && styles.tabsTriggerActive,
          style,
        ]}
        onPress={() => onChange(value)}
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.tabsTriggerText,
            active && styles.tabsTriggerTextActive,
            textStyle,
          ]}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  };
  
  interface TabsContentProps {
    value: string;
    children: ReactNode;
    style?: ViewStyle;
  }
  
  /**
   * Contenido asociado a cada pestaña
   */
  export const TabsContent: React.FC<TabsContentProps> = ({
    value,
    children,
    style,
  }) => {
    const { value: activeValue } = useTabsContext('TabsContent');
  
    if (value !== activeValue) return null;
  
    return <View style={[styles.tabsContent, style]}>{children}</View>;
  };
  
  const styles = StyleSheet.create({
    // equivalente a "flex flex-col gap-2"
    tabsRoot: {
      flexDirection: 'column',
      gap: 8,
    },
    // equivalente a "inline-flex h-9 items-center rounded-xl p-[3px]"
    tabsList: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: '#E5E7EB', // bg-muted aproximado
      borderRadius: 16,
      padding: 3,
    },
    // estilo base del trigger (botón)
    tabsTrigger: {
      flex: 1,
      minWidth: 80,
      height: 32,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    // estilo cuando está activo
    tabsTriggerActive: {
      backgroundColor: '#FFFFFF', // card
      borderColor: '#D1D5DB',     // input border aproximado
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      elevation: 2,
    },
    tabsTriggerText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#6B7280', // text-muted
    },
    tabsTriggerTextActive: {
      color: '#111827', // text-foreground
    },
    tabsContent: {
      flex: 1,
      // aquí puedes poner padding si quieres
    },
  });
  