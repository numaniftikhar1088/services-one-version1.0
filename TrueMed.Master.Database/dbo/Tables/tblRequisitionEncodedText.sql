CREATE TABLE [dbo].[tblRequisitionEncodedText] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Key]         NVARCHAR (MAX) NOT NULL,
    [EncodedText] NVARCHAR (MAX) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

