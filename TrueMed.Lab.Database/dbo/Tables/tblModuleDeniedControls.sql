CREATE TABLE [dbo].[tblModuleDeniedControls] (
    [ModuleId]   INT            NOT NULL,
    [ControlId]  INT            NOT NULL,
    [CreateDate] DATETIME2 (7)  NOT NULL,
    [CreateBy]   NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_tblModuleDeniedControls] PRIMARY KEY CLUSTERED ([ModuleId] ASC, [ControlId] ASC),
    CONSTRAINT [FK_tblModuleDeniedControls_tblControls] FOREIGN KEY ([ControlId]) REFERENCES [dbo].[tblControls] ([ID])
);

