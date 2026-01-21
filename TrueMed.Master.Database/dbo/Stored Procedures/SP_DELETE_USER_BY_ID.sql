CREATE PROC SP_DELETE_USER_BY_ID   
@UserId nvarchar(300),
@LabId int
as  
Begin  
 Update tblLabUsers Set IsDELETED = 1 WHere UserId = @UserId  AND LabId = @LabId
 Select 1 as Deleted  
End