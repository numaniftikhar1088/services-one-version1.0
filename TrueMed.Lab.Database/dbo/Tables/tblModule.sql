CREATE TABLE [dbo].[tblModule] (
    [ModuleId]   INT            NOT NULL,
    [CreateBy]   NVARCHAR (MAX) NOT NULL,
    [CreateDate] DATETIME2 (7)  NOT NULL,
    CONSTRAINT [PK_tblModule] PRIMARY KEY CLUSTERED ([ModuleId] ASC)
);

