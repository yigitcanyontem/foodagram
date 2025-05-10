// ReportModal.tsx
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ReportType } from '@/models/content/dto/ReportType';
import { ReportReason, reportReasonMap } from '@/models/content/dto/ReportReason';
import { ReportService } from '@/services/report-service';
import Toast from 'react-native-toast-message';
import { useAppContext } from '@/context/AppContext';

interface ReportModalProps {
    reportType: ReportType;
    reportedEntityId: string;
    isVisible: boolean;
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
                                                     reportType,
                                                     reportedEntityId,
                                                     isVisible,
                                                     onClose,
                                                 }) => {
    const { userData } = useAppContext();
    const [additionalNotes, setAdditionalNotes] = useState('');

    const submitReport = async (reason: ReportReason) => {
        const dto = {
            reportType,
            reportedEntityId,
            reporterUsername: userData?.username ?? '',
            reason,
            additionalNotes,
        };
        try {
            await ReportService.createReport(dto, userData);
            Toast.show({ type: 'success', text1: 'Report sent' });
        } catch {
            Toast.show({ type: 'error', text1: 'Failed to send report' });
        } finally {
            setAdditionalNotes('');
            onClose();
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Report Message</Text>
                    {Object.entries(reportReasonMap).map(([key, label]) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => submitReport(key as ReportReason)}
                        >
                            <Text style={styles.option}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                    <TextInput
                        style={styles.input}
                        placeholder="Notes (optional)"
                        value={additionalNotes}
                        onChangeText={setAdditionalNotes}
                        multiline
                    />
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },
    box: {
        width: '80%', backgroundColor: '#fff',
        borderRadius: 8, padding: 20, alignItems: 'center',
    },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    option: { fontSize: 16, marginVertical: 8, color: 'blue' },
    input: {
        width: '100%', borderWidth: 1, borderColor: '#ccc',
        borderRadius: 5, padding: 10, marginTop: 12, marginBottom: 20,
        textAlignVertical: 'top',
    },
    cancel: { fontSize: 16, color: 'red' },
});

export default ReportModal;
