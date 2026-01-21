CREATE TABLE [dbo].[tblRoleClaims] (
    [RoleId]  INT NOT NULL,
    [ClaimId] INT NOT NULL,
    CONSTRAINT [PK_tblRoleClaims] PRIMARY KEY CLUSTERED ([RoleId] ASC, [ClaimId] ASC),
    CONSTRAINT [FK_tblRoleClaims_tblRole] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[tblRole] ([Id])
);

