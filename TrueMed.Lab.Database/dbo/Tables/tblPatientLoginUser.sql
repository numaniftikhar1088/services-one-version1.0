CREATE TABLE [dbo].[tblPatientLoginUser] (
    [PatientLoginID] INT            IDENTITY (1, 1) NOT NULL,
    [PatientID]      INT            NULL,
    [Email]          NVARCHAR (MAX) NULL,
    [UserName]       NVARCHAR (50)  NULL,
    [LoginPassword]  NVARCHAR (MAX) NULL,
    [Mobile]         NVARCHAR (50)  NULL,
    [UpdatedBy]      NVARCHAR (200) NULL,
    [UpdatedDate]    DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblPatientLoginUser] PRIMARY KEY CLUSTERED ([PatientLoginID] ASC),
    CONSTRAINT [FK_tblPatientLoginUser_tblPatientBasicInfo] FOREIGN KEY ([PatientID]) REFERENCES [dbo].[tblPatientBasicInfo] ([PatientID])
);


GO
ALTER TABLE [dbo].[tblPatientLoginUser] NOCHECK CONSTRAINT [FK_tblPatientLoginUser_tblPatientBasicInfo];


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'PatientLoginID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient ID (tblPatientAddInfo)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'PatientID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Email (Receive email for username and password)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'Email';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login User Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'UserName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login User Password', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'LoginPassword';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Mobile Number (Receive SMS regarding login etc.)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'Mobile';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login User ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Updated Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientLoginUser', @level2type = N'COLUMN', @level2name = N'UpdatedDate';

