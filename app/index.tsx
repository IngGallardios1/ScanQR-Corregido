import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

import { connectdb, Database } from '../src/database';

import { ScannedCode } from '../src/models';

import { create, getAll } from '../src/webservice';


export default () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedCodes, setScannedCodes] = useState<ScannedCode[]>([]);
    const [db, setDb] = useState<Database>();

    const onBarcodeScanned = async function (result: BarcodeScanningResult) {
        if (window) {
            window.alert(result.data);
        } else {
            Alert.alert('Código Escaneado', result.data, [
                { text: 'OK', style: 'default' }
            ]);
        }

        create({ data: result.data, type: result.type });
        setScannedCodes(await getAll());
    };

    useEffect(() => {
        let isMounted = true;

        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (!isMounted) return;

            if (status !== 'granted') {
                if (isMounted) setErrorMsg('Permiso a la ubicación denegado');
                return;
            }

            let loc = await Location.getCurrentPositionAsync();
            if (isMounted) setLocation(loc);
        }

        async function connect2Db() {
          //setDb(await connectdb());
            //const db = await connectdb();
            //setScannedCodes(await db.consultarCodigos());
        }

        getCurrentLocation();
        connect2Db();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect( () => {
      if (!db) return;

      (async () => {
        setScannedCodes(await getAll());
      })();

      return () => {
        db.close();
      }

    }, [db]);

    if (!permission) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <Text style={styles.loadingText}>Cargando permisos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.permissionContainer}>
                <View style={styles.permissionContent}>
                    <View style={styles.permissionIcon}>
                        <Text style={styles.permissionIconText}>📷</Text>
                    </View>
                    <Text style={styles.permissionTitle}>Acceso a la Cámara</Text>
                    <Text style={styles.permissionMessage}>
                        Necesitamos acceso a tu cámara para escanear códigos QR
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    let locationText = 'Obteniendo ubicación...';
    if (errorMsg) {
        locationText = errorMsg;
    } else if (location) {
        locationText = `Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`;
    }

    const ScannedItem = function ({ item }: { item: ScannedCode }) {
        const onCopyPressed = function () {
            Clipboard.setStringAsync(item.data);
            Alert.alert('Copiado', 'Código copiado al portapapeles');
        };
        
        return (
            <View style={styles.scannedItem}>
                <View style={styles.scannedItemHeader}>
                    <View style={styles.typeTag}>
                        <Text style={styles.typeTagText}>{item.type}</Text>
                    </View>
                </View>
                <Text style={styles.scannedData} numberOfLines={3}>
                    {item.data}
                </Text>
                <TouchableOpacity style={styles.copyButton} onPress={onCopyPressed}>
                    <Text style={styles.copyButtonText}>📋 Copiar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ScanQR</Text>
                <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText}>{locationText}</Text>
                </View>
            </View>

            {/* Camera Section */}
            <View style={styles.cameraContainer}>
                <View style={styles.cameraWrapper}>
                    <CameraView
                        style={styles.cameraView}
                        facing={facing}
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr', 'code128', 'datamatrix', 'aztec', 'ean13'],
                        }}
                        onBarcodeScanned={onBarcodeScanned}
                    />
                    <View style={styles.cameraOverlay}>
                        <View style={styles.scanFrame} />
                        <Text style={styles.scanInstruction}>
                            Apunta la cámara hacia un código QR
                        </Text>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                    <Text style={styles.flipButtonText}>🔄</Text>
                </TouchableOpacity>
            </View>

            {/* Scanned Codes Section */}
            <View style={styles.historyContainer}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Códigos Escaneados</Text>
                    <View style={styles.historyCount}>
                        <Text style={styles.historyCountText}>{scannedCodes.length}</Text>
                    </View>
                </View>
                
                {scannedCodes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>📱</Text>
                        <Text style={styles.emptyStateText}>
                            No hay códigos escaneados aún
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            Los códigos que escanees aparecerán aquí
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={scannedCodes}
                        keyExtractor={(item) => item.id ?? Math.random().toString()}
                        renderItem={ScannedItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f23',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0f0f23',
    },
    loadingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '500',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#0f0f23',
    },
    permissionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    permissionIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#16213e',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    permissionIconText: {
        fontSize: 32,
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionMessage: {
        fontSize: 16,
        color: '#a0a0a0',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    permissionButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    permissionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#1a1a2e',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#16213e',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    locationText: {
        fontSize: 14,
        color: '#a0a0a0',
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative',
    },
    cameraWrapper: {
        flex: 1,
        position: 'relative',
    },
    cameraView: {
        flex: 1,
    },
    cameraOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: '#4f46e5',
        borderRadius: 20,
        backgroundColor: 'transparent',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    scanInstruction: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 24,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    flipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4f46e5',
    },
    flipButtonText: {
        fontSize: 20,
    },
    historyContainer: {
        flex: 1,
        backgroundColor: '#0f0f23',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingTop: 24,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    historyCount: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 32,
        alignItems: 'center',
    },
    historyCountText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#a0a0a0',
        textAlign: 'center',
        lineHeight: 20,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    scannedItem: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#16213e',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scannedItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeTag: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeTagText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    scannedData: {
        fontSize: 16,
        color: '#ffffff',
        lineHeight: 22,
        marginBottom: 12,
    },
    copyButton: {
        backgroundColor: '#16213e',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#4f46e5',
    },
    copyButtonText: {
        color: '#4f46e5',
        fontSize: 14,
        fontWeight: '600',
    },
});