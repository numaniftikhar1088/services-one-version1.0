
create proc sp_AutoGenerateAccession
@LabId int null,
@IDName varchar(max) null,
@RequisitionId int null

as begin
declare @PreFixType varchar(max), @FixedPrefix  varchar(max), @PostFixType  varchar(max),@FixedPostFix  varchar(max), @Seperator  varchar(max),
@StartingNumber int, @TotalLengthofNumber int, @IncrementOn  varchar(max), @IncrementBy int, @InitializeOn  varchar(max), @IDDateFormat  varchar(max)

select top 1 @PreFixType=PreFixType,@FixedPrefix=FixedPreFix,@PostFixType=PostFixType,
@FixedPostFix=FixedPostFix,@Seperator=Seperator,@StartingNumber=StartingNumber,@TotalLengthofNumber=TotalLengthOfStartingNumber, @IncrementOn=IncrementOn,
@IncrementBy=IncrementBy,@InitializeOn=InitializeOn, @IDDateFormat=IDDateFormat
from tblAutoNumberIDFormat where IDName=@IDName and LabID=@LabId
end
