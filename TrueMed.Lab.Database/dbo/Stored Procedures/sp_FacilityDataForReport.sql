CREATE PROC sp_FacilityDataForReport
@pageNumber int null = 1,
@pageSize int null = 200
as
Begin
	SELECT FacilityName as [Facility Name], FacilityPhone [Facility Phone], Address [Facility Address], Address2 [Facility Address2],
	City [Facility City], State [Facility State], ZipCode [Facility ZipCode], FacilityWebsite [Facility Website], ContactFirstName [Primary Contact First Name], ContactLastName [Primary Contact Last Name],
	ContactPrimaryEmail PrimaryContactEmail, ContactPhone PrimaryContactPhone,
	CriticalFirstName [Critical First Name], CriticalLastName [Critical Last Name], CriticalContactEmail [Critical Contact Email], CriticalPhone [Critical Phone], FacilityFax [Facility Fax]
	FROM tblFacility
	ORDER BY CreatedTime DESC 
	OFFSET (@pageNumber - 1) * @pageSize ROWS
	FETCH NEXT @pageSize ROWS ONLY
End