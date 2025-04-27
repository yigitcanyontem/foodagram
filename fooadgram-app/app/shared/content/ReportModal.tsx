import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {ReportType} from "@/models/content/dto/ReportType";
import {ReportReason, reportReasonMap} from "@/models/content/dto/ReportReason";
import {ReportService} from "@/services/report-service";
import Toast from "react-native-toast-message";
import {useAppContext} from "@/context/AppContext";
import {FontAwesome} from "@expo/vector-icons";

interface ReportModalProps {
    reportType: ReportType;
    reportedEntityId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({reportType, reportedEntityId}) => {
    const {userData} = useAppContext();
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isReportModalVisible, setReportModalVisible] = useState(false);

    const toggleReportModal = () => {
        setReportModalVisible(!isReportModalVisible);
    };

    const onReport = async (reason: ReportReason) => {
        const reportCreationDto = {
            reportType,
            reportedEntityId,
            reporterUsername: userData ? userData.username : '',
            reason,
            additionalNotes,
        };

        console.log('Report Creation DTO:', reportCreationDto);

        await ReportService.createReport(reportCreationDto, userData)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Report submitted successfully',
                    position: 'top',
                    topOffset: 60,
                });
            })
            .catch((error) => {
                console.error('Error while submitting report:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error while submitting report',
                    position: 'top',
                    topOffset: 60,
                });
            })
            .finally(() => {
                setAdditionalNotes(''); // Clear notes after submission
                toggleReportModal();
            });
    };

    return (
        <View>
            <TouchableOpacity style={styles.backButton} onPress={toggleReportModal}>
                <FontAwesome name="ellipsis-v" size={24} color="#8E8E8E"/>
            </TouchableOpacity>

            { isReportModalVisible &&
                <Modal
                    visible={isReportModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={toggleReportModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Report Post</Text>
                            {Object.entries(reportReasonMap).map(([key, value]) => (
                                <TouchableOpacity key={key} onPress={() => onReport(key as ReportReason)}>
                                    <Text style={styles.modalOption}>{value}</Text>
                                </TouchableOpacity>
                            ))}
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter additional notes (optional)"
                                value={additionalNotes}
                                onChangeText={setAdditionalNotes}
                                multiline
                            />
                            <TouchableOpacity onPress={toggleReportModal}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalOption: {
        fontSize: 16,
        marginVertical: 10,
        color: 'blue',
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalCancel: {
        fontSize: 16,
        marginTop: 20,
        color: 'red',
    },
    backButton: {
        marginBottom: 10,
    },

});

export default ReportModal;
