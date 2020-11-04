<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\ModuleNameMapperInterface;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use aCase;
use SugarBean;
use App\Legacy\Data\AuditQueryingTrait;
use App\Legacy\LegacyHandler;
use App\Legacy\LegacyScopeState;

class CaseDaysOpen extends LegacyHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;
    use AuditQueryingTrait;

    public const HANDLER_KEY = 'case-days-open';
    public const KEY = 'case-days-open';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * ListDataHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        EntityManagerInterface $entityManager
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->entityManager = $entityManager;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return self::KEY;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function getData(array $query): Statistic
    {
        [$module, $id] = $this->extractContext($query);

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }


        $legacyModuleName = $this->moduleNameMapper->toLegacy($module);

        if ($legacyModuleName !== 'Cases') {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $case = $this->getCase($id);
        $rows = $this->getAuditInfo($case);

        $start = $case->date_entered;

        $end = null;

        if ($this->inClosedState($case)) {
            $end = $case->date_entered;
            if (!empty($rows) && !empty($rows[$this->getClosedStatus()])) {
                $end = $rows[$case->state]['last_update'] ?? $case->date_entered;
            }
        }

        $statistic = $this->getDateDiffStatistic(self::KEY, $start, $end);

        $this->close();

        return $statistic;

    }

    /**
     * @param SugarBean $bean
     * @return array
     * @throws DBALException
     */
    protected function getAuditInfo(SugarBean $bean): array
    {
        return $this->queryAuditInfo($this->entityManager, $bean, 'state');
    }


    /**
     * @param aCase $case
     * @return bool
     */
    protected function inClosedState(aCase $case): bool
    {
        return $case->state === 'Closed';
    }
    /**
     * @param string $id
     * @return aCase
     */

    protected function getCase(string $id): aCase
    {
        /** @var aCase $case */
        $case = BeanFactory::getBean('Cases', $id);

        return $case;
    }

    /**
     * @return string
     */
    protected function getClosedStatus(): string
    {
        return 'Closed';
    }

}
