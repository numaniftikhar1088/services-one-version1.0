CREATE PROC SP_ActivationUserById 
@UserId nvarchar(300),
@IsActive bit
as 
Begin
	Update tblUser SET IsActive =  @IsActive  Where Id = @userId
	SELECT 1 as Activation
End