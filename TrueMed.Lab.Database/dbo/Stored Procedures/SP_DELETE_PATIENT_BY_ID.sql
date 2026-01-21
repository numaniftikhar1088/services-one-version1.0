CREATE PROC SP_DELETE_PATIENT_BY_ID
@patientId int
as
Begin
	
	Update tblPatientBasicInfo SET IsDeleted = 1 Where PatientID = PatientID
	SELECT 1 as Deleted
End