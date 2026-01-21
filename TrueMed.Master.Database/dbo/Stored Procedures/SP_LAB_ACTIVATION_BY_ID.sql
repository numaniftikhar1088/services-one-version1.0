CREATE PROC SP_LAB_ACTIVATION_BY_ID
@labId int,
@isActive bit,
@userId nvarchar
as
Begin
	UPDATE tblLabs SET IsActive = @isActive, UpdatedDate = GETDATE(),UpdatedBy = @userId  Where  LabId = @labId
	SELECT 1 as [Activation]
End