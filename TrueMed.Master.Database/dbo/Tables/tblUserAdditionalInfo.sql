CREATE TABLE [dbo].[tblUserAdditionalInfo] (
    [UserId]             NVARCHAR (200) NOT NULL,
    [IsReferenceLabUser] BIT            NULL,
    [ReferenceLabName]   NVARCHAR (MAX) NULL,
    [NPI]                NVARCHAR (200) NULL,
    [StateLicenseNo]     NVARCHAR (200) NULL,
    CONSTRAINT [PK__tblUserA__1788CC4C7487147B] PRIMARY KEY CLUSTERED ([UserId] ASC)
);

