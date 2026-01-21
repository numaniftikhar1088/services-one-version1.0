CREATE TABLE [dbo].[tblUserClaims] (
    [UserId]    NVARCHAR (300) NOT NULL,
    [ClaimId]   INT            NOT NULL,
    [PageId]    INT            NULL,
    [IsChecked] BIT            NULL,
    CONSTRAINT [PK_tblUserClaims] PRIMARY KEY CLUSTERED ([UserId] ASC, [ClaimId] ASC)
);

