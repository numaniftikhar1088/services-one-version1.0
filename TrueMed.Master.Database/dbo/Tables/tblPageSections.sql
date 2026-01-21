CREATE TABLE [dbo].[tblPageSections] (
    [PageId]       INT            NOT NULL,
    [SectionId]    INT            NOT NULL,
    [ClaimId]      INT            NULL,
    [IsReqSection] INT            NOT NULL,
    [CustomScript] NVARCHAR (MAX) NULL,
    [SortOrder]    INT            NULL,
    [DisplayType]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblPageSectionsReq] PRIMARY KEY CLUSTERED ([PageId] ASC, [SectionId] ASC, [IsReqSection] ASC),
    CONSTRAINT [FK_tblPageSections_tblClaims] FOREIGN KEY ([ClaimId]) REFERENCES [dbo].[tblClaims] ([Id]),
    CONSTRAINT [FK_tblPageSections_tblPages] FOREIGN KEY ([PageId]) REFERENCES [dbo].[tblPages] ([Id]),
    CONSTRAINT [FK_tblPageSections_tblSections] FOREIGN KEY ([SectionId]) REFERENCES [dbo].[tblSections] ([ID])
);

