CREATE TABLE [dbo].[tblUserfavouriteMenu] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [favouriteMenuId] INT            NULL,
    [UserId]          NVARCHAR (200) NULL,
    [Link]            NVARCHAR (MAX) NULL,
    [Icon]            NVARCHAR (MAX) NULL,
    [IsChecked]       BIT            NULL,
    CONSTRAINT [PK_tblUserfavouriteMenu] PRIMARY KEY CLUSTERED ([Id] ASC)
);

