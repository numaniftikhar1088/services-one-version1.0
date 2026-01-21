CREATE TABLE [dbo].[tblModuleSections] (
    [SectionId]  INT            NOT NULL,
    [ModuleId]   INT            NOT NULL,
    [CreateDate] DATETIME2 (7)  NULL,
    [CreateBy]   NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblModuleSections] PRIMARY KEY CLUSTERED ([SectionId] ASC, [ModuleId] ASC),
    CONSTRAINT [FK_tblModuleSections_tblModules] FOREIGN KEY ([ModuleId]) REFERENCES [dbo].[tblModules] ([Id]),
    CONSTRAINT [FK_tblModuleSections_tblSections] FOREIGN KEY ([SectionId]) REFERENCES [dbo].[tblSections] ([ID])
);

