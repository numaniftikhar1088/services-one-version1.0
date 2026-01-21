CREATE TABLE [dbo].[tblPages] (
    [Id]         INT            NOT NULL,
    [CreateDate] DATETIME2 (7)  NOT NULL,
    [CreateBy]   NVARCHAR (300) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

