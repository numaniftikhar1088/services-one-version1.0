CREATE TABLE [dbo].[tblDirectorInformation] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [FirstName]     NVARCHAR (200) NOT NULL,
    [MiddleName]    NVARCHAR (200) NULL,
    [LastName]      NVARCHAR (200) NOT NULL,
    [EmailAddress]  NVARCHAR (200) NOT NULL,
    [Mobile]        NVARCHAR (200) NULL,
    [Phone]         NVARCHAR (200) NULL,
    [Address1]      NVARCHAR (200) NULL,
    [City]          NVARCHAR (200) NULL,
    [State]         NVARCHAR (200) NULL,
    [Address2]      NVARCHAR (200) NULL,
    [ZipCode]       NVARCHAR (50)  NULL,
    [CapInfoNumber] NVARCHAR (250) NULL,
    [NoCapProvider] NVARCHAR (250) NULL,
    [LabId]         INT            NULL,
    CONSTRAINT [PK_tblDirectorInformation_1] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_tblDirectorInformation_tblLabs] FOREIGN KEY ([LabId]) REFERENCES [dbo].[tblLabs] ([LabId])
);

