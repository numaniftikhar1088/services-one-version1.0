CREATE TABLE [dbo].[tblUserActivity] (
    [ID]                 NVARCHAR (400) DEFAULT (newid()) NOT NULL,
    [CreateDate]         DATETIME       NOT NULL,
    [UserId]             NVARCHAR (300) NOT NULL,
    [ActivityType]       INT            NOT NULL,
    [ActionType]         INT            NOT NULL,
    [ActionDescription]  NVARCHAR (MAX) NULL,
    [ExtentionData]      NVARCHAR (MAX) NULL,
    [EventName]          NVARCHAR (20)  NULL,
    [ActivityActionPage] NVARCHAR (500) NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC)
);

