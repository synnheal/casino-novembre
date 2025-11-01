import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, betAmount, multiplier } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Calculer les gains
    const winAmount = BigInt(Math.floor(betAmount * multiplier));

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Ajouter les crédits
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { credits: user.credits + winAmount },
    });

    // Sauvegarder dans la BDD
    await prisma.casinoGame.create({
      data: {
        userId: decoded.userId,
        gameType: 'crash',
        betAmount: BigInt(betAmount),
        winAmount,
        result: {
          type: 'win',
          cashoutMultiplier: multiplier,
        },
      },
    });

    // Mettre à jour les stats
    const stats = await prisma.casinoStats.findUnique({
      where: { userId: decoded.userId },
    });

    if (stats) {
      await prisma.casinoStats.update({
        where: { userId: decoded.userId },
        data: {
          totalGames: stats.totalGames + 1,
          totalWagered: stats.totalWagered + BigInt(betAmount),
          totalWon: stats.totalWon + winAmount,
          biggestWin: winAmount > stats.biggestWin ? winAmount : stats.biggestWin,
        },
      });
    }

    return NextResponse.json({
      success: true,
      multiplier,
      winAmount: winAmount.toString(),
      profit: (winAmount - BigInt(betAmount)).toString(),
      balance: updatedUser.credits.toString(),
    });
  } catch (error) {
    console.error('Erreur API /api/crash/cashout:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
