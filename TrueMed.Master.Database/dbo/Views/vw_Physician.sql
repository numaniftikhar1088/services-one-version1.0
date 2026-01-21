CREATE VIEW vw_Physician
as
SELECT  Id [Physician Id], FirstName [Physician First Name],LastName [Physician Last Name],Email [Physician Email],PhoneNumber [Physician Phone Number], A.NPI [Physician NPI], A.StateLicenseNo [Physician State License No] FROM tblUser u
JOIN tblUserAdditionalInfo a
on u.Id =  u.ID
