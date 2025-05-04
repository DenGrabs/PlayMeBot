import copy
import os

from aiogram.filters import CommandStart, CommandObject
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from dotenv import load_dotenv

from aiogram import types, Router

from bot import bot

router = Router()

load_dotenv()

@router.message(CommandStart(deep_link=True))
async def cmd_start(message: Message, command: CommandObject):
    start_arg = command.args
    
    print(f"Start argument received: {start_arg}")
    
    await message.answer(f"Welcome, {message.from_user.first_name}!\nYou used the start command with argument: {start_arg}")

@router.message(CommandStart())
async def cmd_start_basic(message: Message):
    await message.answer(f"Welcome, {message.from_user.first_name}!\nYou used no start argument")
    