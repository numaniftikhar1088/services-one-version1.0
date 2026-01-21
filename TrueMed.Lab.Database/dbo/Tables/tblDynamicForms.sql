CREATE TABLE [dbo].[tblDynamicForms] (
    [Key]         VARCHAR (300)  NOT NULL,
    [CreateDate]  DATETIME2 (7)  DEFAULT (getdate()) NOT NULL,
    [Form]        NVARCHAR (MAX) NULL,
    [Description] NVARCHAR (MAX) NULL,
    [RawForm]     NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([Key] ASC)
);

