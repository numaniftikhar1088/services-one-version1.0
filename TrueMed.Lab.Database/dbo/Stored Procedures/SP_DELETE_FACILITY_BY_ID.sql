CREATE PROC SP_DELETE_FACILITY_BY_ID
@facilitId int,
@userId nvarchar(300)
as
Begin
	UPDATE tblFacility Set IsDeleted = 1 Where FacilityId = @facilitId
	SELECT 1 as Deleted 
End