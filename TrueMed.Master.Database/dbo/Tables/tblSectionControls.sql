CREATE TABLE [dbo].[tblSectionControls] (
    [Id]        INT IDENTITY (1, 1) NOT NULL,
    [SectionId] INT NULL,
    [ControlId] INT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK__tblSectio__Contr__3118447E] FOREIGN KEY ([ControlId]) REFERENCES [dbo].[tblControls] ([ID]),
    CONSTRAINT [FK__tblSectio__Secti__30242045] FOREIGN KEY ([SectionId]) REFERENCES [dbo].[tblSections] ([ID])
);

