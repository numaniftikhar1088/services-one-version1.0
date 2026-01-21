CREATE TABLE [dbo].[tblModulePages] (
    [ModuleId] INT NOT NULL,
    [PageId]   INT NOT NULL,
    CONSTRAINT [PK_tblModulePages_1] PRIMARY KEY CLUSTERED ([ModuleId] ASC, [PageId] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_tblModulePages]
    ON [dbo].[tblModulePages]([ModuleId] ASC);

