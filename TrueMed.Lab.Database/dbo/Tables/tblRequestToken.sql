CREATE TABLE [dbo].[tblRequestToken] (
    [UserId]      NVARCHAR (300) NOT NULL,
    [Token]       NVARCHAR (MAX) NOT NULL,
    [CreateDate]  DATETIME2 (7)  DEFAULT (getdate()) NOT NULL,
    [Type]        INT            NOT NULL,
    [ExpireyDate] DATETIME2 (7)  NULL,
    [IsValid]     BIT            DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([UserId] ASC, [CreateDate] ASC)
);

