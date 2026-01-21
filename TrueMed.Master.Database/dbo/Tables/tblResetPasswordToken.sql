CREATE TABLE [dbo].[tblResetPasswordToken] (
    [Id]             INT            IDENTITY (1, 1) NOT NULL,
    [Token]          NVARCHAR (MAX) NULL,
    [CreatedDate]    DATETIME       NULL,
    [ExpirationDate] DATETIME       NULL,
    [UserId]         NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

