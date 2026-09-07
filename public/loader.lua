--[[
    Writz Hub Executor
    Compatible: Xeno / Solara / Delta / Wave / Swift / Codex / Synapse / Script-Ware

    Paste this entire script into your executor.
]]

local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local CoreGui = game:GetService("CoreGui")

local HUB_URL = "https://writzzzzzz.vercel.app/loader.lua"

-- Clean previous instance
pcall(function()
    local old = CoreGui:FindFirstChild("WritzExecutor")
    if old then old:Destroy() end
end)

--------------------------------------------------------------------
-- UI
--------------------------------------------------------------------
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "WritzExecutor"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ScreenGui.Parent = CoreGui

local Main = Instance.new("Frame")
Main.Name = "Main"
Main.Size = UDim2.new(0, 520, 0, 340)
Main.Position = UDim2.new(0.5, -260, 0.5, -170)
Main.BackgroundColor3 = Color3.fromRGB(12, 12, 14)
Main.BorderSizePixel = 0
Main.Active = true
Main.Draggable = true
Main.Parent = ScreenGui

local Corner = Instance.new("UICorner")
Corner.CornerRadius = UDim.new(0, 10)
Corner.Parent = Main

local Stroke = Instance.new("UIStroke")
Stroke.Color = Color3.fromRGB(40, 40, 48)
Stroke.Thickness = 1
Stroke.Parent = Main

-- Title bar
local TitleBar = Instance.new("Frame")
TitleBar.Size = UDim2.new(1, 0, 0, 36)
TitleBar.BackgroundColor3 = Color3.fromRGB(18, 18, 22)
TitleBar.BorderSizePixel = 0
TitleBar.Parent = Main

local TitleCorner = Instance.new("UICorner")
TitleCorner.CornerRadius = UDim.new(0, 10)
TitleCorner.Parent = TitleBar

local TitleFix = Instance.new("Frame")
TitleFix.Size = UDim2.new(1, 0, 0, 12)
TitleFix.Position = UDim2.new(0, 0, 1, -12)
TitleFix.BackgroundColor3 = Color3.fromRGB(18, 18, 22)
TitleFix.BorderSizePixel = 0
TitleFix.Parent = TitleBar

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, -80, 1, 0)
Title.Position = UDim2.new(0, 14, 0, 0)
Title.BackgroundTransparency = 1
Title.Text = "Writz Hub  ·  Executor"
Title.TextColor3 = Color3.fromRGB(230, 230, 235)
Title.Font = Enum.Font.GothamBold
Title.TextSize = 14
Title.TextXAlignment = Enum.TextXAlignment.Left
Title.Parent = TitleBar

local CloseBtn = Instance.new("TextButton")
CloseBtn.Size = UDim2.new(0, 28, 0, 28)
CloseBtn.Position = UDim2.new(1, -32, 0, 4)
CloseBtn.BackgroundColor3 = Color3.fromRGB(28, 28, 34)
CloseBtn.Text = "×"
CloseBtn.TextColor3 = Color3.fromRGB(200, 200, 210)
CloseBtn.Font = Enum.Font.GothamBold
CloseBtn.TextSize = 18
CloseBtn.Parent = TitleBar

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 6)
CloseCorner.Parent = CloseBtn

CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

-- Script box
local ScriptBox = Instance.new("TextBox")
ScriptBox.Size = UDim2.new(1, -28, 1, -110)
ScriptBox.Position = UDim2.new(0, 14, 0, 48)
ScriptBox.BackgroundColor3 = Color3.fromRGB(8, 8, 10)
ScriptBox.TextColor3 = Color3.fromRGB(180, 255, 180)
ScriptBox.PlaceholderText = "-- Paste your script here or click Load Hub"
ScriptBox.PlaceholderColor3 = Color3.fromRGB(80, 80, 90)
ScriptBox.Font = Enum.Font.Code
ScriptBox.TextSize = 13
ScriptBox.TextXAlignment = Enum.TextXAlignment.Left
ScriptBox.TextYAlignment = Enum.TextYAlignment.Top
ScriptBox.ClearTextOnFocus = false
ScriptBox.MultiLine = true
ScriptBox.Text = ""
ScriptBox.BorderSizePixel = 0
ScriptBox.Parent = Main

local BoxCorner = Instance.new("UICorner")
BoxCorner.CornerRadius = UDim.new(0, 8)
BoxCorner.Parent = ScriptBox

local BoxPad = Instance.new("UIPadding")
BoxPad.PaddingTop = UDim.new(0, 8)
BoxPad.PaddingLeft = UDim.new(0, 10)
BoxPad.PaddingRight = UDim.new(0, 10)
BoxPad.Parent = ScriptBox

-- Buttons
local function makeButton(text, x, color)
    local btn = Instance.new("TextButton")
    btn.Size = UDim2.new(0, 110, 0, 32)
    btn.Position = UDim2.new(0, x, 1, -44)
    btn.BackgroundColor3 = color
    btn.Text = text
    btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    btn.Font = Enum.Font.GothamMedium
    btn.TextSize = 13
    btn.BorderSizePixel = 0
    btn.Parent = Main

    local c = Instance.new("UICorner")
    c.CornerRadius = UDim.new(0, 7)
    c.Parent = btn

    return btn
end

local ExecuteBtn = makeButton("Execute", 14, Color3.fromRGB(40, 160, 90))
local ClearBtn   = makeButton("Clear", 134, Color3.fromRGB(50, 50, 60))
local LoadHubBtn = makeButton("Load Hub", 254, Color3.fromRGB(70, 100, 200))
local KillBtn    = makeButton("Kill UI", 374, Color3.fromRGB(160, 50, 50))

--------------------------------------------------------------------
-- Core logic
--------------------------------------------------------------------
local function safeExecute(source)
    if not source or source == "" then return end
    local fn, err = loadstring(source)
    if not fn then
        warn("[Writz] Compile error:", err)
        return
    end
    local ok, runtimeErr = pcall(fn)
    if not ok then
        warn("[Writz] Runtime error:", runtimeErr)
    end
end

ExecuteBtn.MouseButton1Click:Connect(function()
    safeExecute(ScriptBox.Text)
end)

ClearBtn.MouseButton1Click:Connect(function()
    ScriptBox.Text = ""
end)

KillBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

LoadHubBtn.MouseButton1Click:Connect(function()
    LoadHubBtn.Text = "Loading..."
    LoadHubBtn.BackgroundColor3 = Color3.fromRGB(50, 70, 140)

    local ok, result = pcall(function()
        return game:HttpGet(HUB_URL)
    end)

    if ok and result and #result > 0 then
        ScriptBox.Text = result
        safeExecute(result)
        LoadHubBtn.Text = "Loaded ✓"
        LoadHubBtn.BackgroundColor3 = Color3.fromRGB(40, 160, 90)
        task.delay(1.5, function()
            if LoadHubBtn and LoadHubBtn.Parent then
                LoadHubBtn.Text = "Load Hub"
                LoadHubBtn.BackgroundColor3 = Color3.fromRGB(70, 100, 200)
            end
        end)
    else
        LoadHubBtn.Text = "Failed"
        LoadHubBtn.BackgroundColor3 = Color3.fromRGB(160, 50, 50)
        warn("[Writz] Failed to fetch hub loader:", result)
        task.delay(2, function()
            if LoadHubBtn and LoadHubBtn.Parent then
                LoadHubBtn.Text = "Load Hub"
                LoadHubBtn.BackgroundColor3 = Color3.fromRGB(70, 100, 200)
            end
        end)
    end
end)

UserInputService.InputBegan:Connect(function(input, processed)
    if processed then return end
    if input.KeyCode == Enum.KeyCode.Return and UserInputService:IsKeyDown(Enum.KeyCode.LeftControl) then
        safeExecute(ScriptBox.Text)
    end
end)

print("[Writz Hub] Executor loaded. Click Load Hub or paste a script.")
