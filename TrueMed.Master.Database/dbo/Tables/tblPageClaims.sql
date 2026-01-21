CREATE TABLE [dbo].[tblPageClaims] (
    [PageId]  INT NOT NULL,
    [ClaimId] INT NOT NULL,
    CONSTRAINT [PK_tblPageClaims] PRIMARY KEY CLUSTERED ([PageId] ASC, [ClaimId] ASC),
    CONSTRAINT [FK_tblPageClaims_tblClaims] FOREIGN KEY ([ClaimId]) REFERENCES [dbo].[tblClaims] ([Id]),
    CONSTRAINT [FK_tblPageClaims_tblPages] FOREIGN KEY ([PageId]) REFERENCES [dbo].[tblPages] ([Id])
);

